# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
# TSならビルド、JSならスキップ
COPY tsconfig.json .  # TSのみ
COPY src ./src
RUN npm run build     # JSなら代わりに: RUN mkdir -p dist && cp -r src dist

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node","dist/index.js"]
