FROM node:24-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["sleep", "infinity"]

# CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# CMD [ "tail", "-f", "/dev/null" ]