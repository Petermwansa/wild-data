from django.shortcuts import render
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time
from django.http import JsonResponse


def get_content(product_name, limit=5000):
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    try:
        search_url = f"https://www.wildberries.ru/catalog/0/search.aspx?search={product_name}"
        driver.get(search_url)
        time.sleep(3)

        SCROLL_PAUSE_TIME = 2
        MAX_SCROLLS = 200  # Stop after 20 scrolls max to prevent infinite loops
        seen_articles = set()
        products = []

        scroll_count = 0
        last_height = driver.execute_script("return document.body.scrollHeight")

        while len(products) < limit and scroll_count < MAX_SCROLLS:
            # Scroll down
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(SCROLL_PAUSE_TIME)

            # Look for new items
            items = driver.find_elements(By.CLASS_NAME, "product-card")

            for item in items:
                try:
                    article = item.get_attribute("data-nm-id")
                    if not article or article in seen_articles:
                        continue  # Skip duplicates or missing IDs

                    name = item.find_element(By.CLASS_NAME, "product-card__name").text.strip()
                    price = item.find_element(By.CLASS_NAME, "price__lower-price").text.strip()
                    try:
                        color = item.find_element(By.CLASS_NAME, "color").text.strip()
                    except:
                        color = "N/A"

                    products.append({
                        "article": article,
                        "name": name,
                        "price": price,
                        "color": color,
                    })
                    seen_articles.add(article)

                    if len(products) >= limit:
                        break

                except Exception as e:
                    print("Error scraping product:", e)
                    continue

            # Break if no new content loaded
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
            scroll_count += 1

        print(f"Collected {len(products)} products.")
        return products

    finally:
        driver.quit()

        

def scrape_view(request):
    product_query = request.GET.get("product")
    products = get_content(product_query) if product_query else []
    return JsonResponse({"products": products}, safe=False)
