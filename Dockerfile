ARG tag
FROM prismagraphql/prisma:$tag
COPY ./configs/deploy/prerun_hook.sh /app/prerun_hook.sh
CMD /app/start.sh