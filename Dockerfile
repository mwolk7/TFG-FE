FROM nginx:latest

WORKDIR ~/docker-compose/nginx/

COPY dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/

COPY nginx.conf.ssl.template /usr/share/nginx/nginx.conf.ssl.template

COPY start.sh /usr/share/nginx/start.sh
RUN chmod +x /usr/share/nginx/start.sh

ENTRYPOINT ["/usr/share/nginx/start.sh"]

