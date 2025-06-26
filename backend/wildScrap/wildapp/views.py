
from django.shortcuts import render
from django.http import JsonResponse
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time


def get_content(product_name, limit=5):  # I reduced for performance in development mode but it can be removed in production
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    try:
        search_url = f"https://www.wildberries.ru/catalog/0/search.aspx?search={product_name}"
        driver.get(search_url)
        time.sleep(3)

        SCROLL_PAUSE_TIME = 1.5
        MAX_SCROLLS = 100
        seen_articles = set()
        products = []

        scroll_count = 0
        last_height = driver.execute_script("return document.body.scrollHeight")

        while len(products) < limit and scroll_count < MAX_SCROLLS:
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(SCROLL_PAUSE_TIME)
            driver.execute_script("window.scrollBy(0, 1000);")
            time.sleep(SCROLL_PAUSE_TIME)

            items = driver.find_elements(By.CLASS_NAME, "product-card")

            for item in items:
                try:
                    article = item.get_attribute("data-nm-id")
                    if not article or article in seen_articles:
                        continue

                    # here we scrape the products by class name 
                    image = item.find_element(By.CLASS_NAME, "j-thumbnail").get_attribute("src")
                    name = item.find_element(By.CLASS_NAME, "product-card__name").text.strip()
                    price = item.find_element(By.CLASS_NAME, "price__lower-price").text.strip()
                    brand = item.find_element(By.CLASS_NAME, "product-card__brand").text.strip()

                    # Navigate to product detail page to extract the color
                    product_url = f"https://www.wildberries.ru/catalog/{article}/detail.aspx"
                    driver.execute_script("window.open('');")
                    driver.switch_to.window(driver.window_handles[1])
                    driver.get(product_url)
                    time.sleep(2)

                    # Scrape color
                    try:
                        color = driver.find_element(By.CLASS_NAME, "color-name").text.strip()
                    except:
                        color = "Н/Д"


                    # Close tab and go back
                    driver.close()
                    driver.switch_to.window(driver.window_handles[0])

                    products.append({
                        "article": article,
                        "image": image,
                        "name": name,
                        "price": price,
                        "brand": brand,
                        "color": color,
                        "url": product_url,
                    })
                    seen_articles.add(article)

                    if len(products) >= limit:
                        break

                except Exception as e:
                    print("Error scraping product:", e)
                    continue

            scroll_count += 1

        print(f"Collected {len(products)} products.")
        return products

    finally:
        driver.quit()


# the function of the api that will be rendered using ReactJS 
def scrape_view(request):
    product_query = request.GET.get("product")
    products = get_content(product_query) if product_query else []
    return JsonResponse({"products": products}, safe=False)

