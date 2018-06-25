FROM python:3.6
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /app
 WORKDIR /app
 ADD src/requirements.txt /app/
 RUN pip install -r requirements.txt
 ADD . /app/
