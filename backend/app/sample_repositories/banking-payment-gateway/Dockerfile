FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates build-essential
COPY ./certs/gateway-cert.pem /etc/ssl/certs/
WORKDIR /app
COPY . .
CMD ["./build/payment_gateway"]
