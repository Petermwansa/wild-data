#  Wildberries E-Commerce Web Scraper 

A full-stack web scraping project built with **Django** (backend) and **React** (frontend) that scrapes product data from an e-commerce website and displays it in a clean, user-friendly interface.

---

#  Features

- Scrapes product data such as name, price, image, and description.
- Stores scraped data in a Django backend (SQLite).
- Displays products in a React frontend with filtering and search.
- Refresh (re-scrape) data from the frontend.
- API built with Django REST Framework.
- Cross-Origin support for frontend-backend communication.

---

##  Tech Stack

**Frontend:**
- React (Vite or Create React App)
- Axios

**Backend:**
- Django
- BeautifulSoup4
- Requests
- Django CORS Headers

---



#  THE DEVELOPMENT PROCESS

First created the react frontend and ensured that it was working using dummy data

Then I separated the folders and created a backend folder to scrap the data from the e-commerce website

---



# The Backend

Firstly, ensure that Python is installed in your computer

You can check for the it using the command below

```bash
python3 --version
```


Then, I set up a virtual environment which helps you
```bash
pip3 install virtualenv
```

Then I created a virtual env
```bash 
python3 -m venv venv
```


Then I activated the virtual env
```bash 
source venv/bin/activate
```


Then install Django in the working directory
```bash 
pip3 install django
```


To ensure that django is installed properly, you should verify with the command below
```bash 
django-admin --version
```


Then I created the django project
```bash 
django-admin startproject wildScrap
```


Then cd into wildScrap 
```bash
cd wildScrap
```


Then I created the app using 
```bash
python3 manage.py startapp wildapp
```

Then I registered the app in the settings.py file as shown below
```bash 
# Application definition
INSTALLED_APPS = [
    ...
    'wildapp'
]
```

Then I verified that I have finished setting up my project by running the server using the command below
```bash
python3 manage.py runserver
```

---


# The Frontend

I used React JS to render the fetched data to the frontend.
It is a basic react app created with vite with a component that contains all the logic and filtering functions using state management 

---



#  How It Works

User Action: A user visits the frontend and clicks "Search" or refreshes the page.

API Call: React makes an API request to Django’s /api/scrape/ endpoint.

Web Scraping: Django scrapes the data from the wildberries website

Returns Data: Data is returned via API endpoint to the frontend and rendered as a table.










Built by Peter Mwansa

