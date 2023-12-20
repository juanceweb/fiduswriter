# syntax=docker/dockerfile:1
FROM python:3.9-alpine
WORKDIR /fiduswriter
#ENV FastAPI_APP=main.py
#ENV FastAPI_RUN_HOST=0.0.0.0
COPY ./fiduswriter /fiduswriter

# sudo apt install libjpeg-dev python3-dev python3-pip gettext zlib1g-dev git npm nodejs build-essential

RUN apk add --no-cache gcc musl-dev linux-headers
RUN pip3 install -r requirements.txt
EXPOSE 5000

# ./manage.py setup
# ./manage.py runserver

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
