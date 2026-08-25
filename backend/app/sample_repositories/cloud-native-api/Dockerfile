FROM golang:1.21-alpine
RUN apk add --no-cache openssl ca-certificates git
WORKDIR /app
COPY go.mod go.sum ./
COPY . .
RUN go build -o /server ./src/crypto_service.go
CMD ["/server"]
