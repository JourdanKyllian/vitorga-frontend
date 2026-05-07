# ============ STAGE 1 : BUILD ============
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============ STAGE 2 : PRODUCTION (nginx) ============
FROM nginx:alpine AS production
LABEL maintainer="vitorga"

RUN apk upgrade --no-cache \
  && addgroup -g 1001 -S nginx-user \
  && adduser -S nginx-user -u 1001

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]