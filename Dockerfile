ARG tag
FROM prismagraphql/prisma:$tag
COPY ./prisma/prisma.yml /app/config.yml
COPY ./configs/deploy/prerun_hook.sh /app/prerun_hook.sh
CMD /app/start.sh