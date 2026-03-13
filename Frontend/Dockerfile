FROM nginxinc/nginx-unprivileged:1.29-alpine

ENV API_UPSTREAM=http://rohkeymon-api:8080

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY . /usr/share/nginx/html/

EXPOSE 8080
