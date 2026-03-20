# Multi-stage build: Vite kompilieren, danach statisch via Nginx ausliefern
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

# Service-URLs werden zur Build-Zeit eingebrannt (aus .env.production oder --build-env-vars).
ARG VITE_API_URL
ARG VITE_ANALYSIS_API_URL
ARG VITE_CHART_API_URL
ARG VITE_FILE_API_URL
ARG VITE_USER_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ANALYSIS_API_URL=$VITE_ANALYSIS_API_URL
ENV VITE_CHART_API_URL=$VITE_CHART_API_URL
ENV VITE_FILE_API_URL=$VITE_FILE_API_URL
ENV VITE_USER_API_URL=$VITE_USER_API_URL

RUN npm run build

FROM nginx:1.27-alpine AS runtime

# Cloud Run setzt den Port via PORT-Umgebungsvariable.
ENV PORT=3000

# Nginx Template, das beim Container-Start per envsubst zu default.conf wird.
RUN rm -f /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/nginx/templates
RUN printf 'server {\n  listen ${PORT};\n  server_name _;\n\n  root /usr/share/nginx/html;\n  index index.html;\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/templates/default.conf.template

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

