# inTouch
Simple chat web application.

# Progress
   - in development
# Stack :

### backend

  - django v.2
  - django-channels
  - django framework
### frontend
  -  Reactjs
  -  webpack

### Installation

Requires [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) to run
Using compose file format v.3
Check [Compatibility matrix](https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix)



#### Atention !!!
> frontend part not included to docker build yet
> create bundles manualy

```sh
npm install
npm start
```

Create docker container and compose

```sh
$ make build
$ make up
```

Production environment

```sh
$ not implemented yet!
```
