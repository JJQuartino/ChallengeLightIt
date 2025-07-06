FROM php:8.3-fpm

#Instalar dependencias
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libzip-dev \
    libonig-dev libxml2-dev netcat-traditional \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#Instalar Node
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

#Instalar composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

#Establecer carpeta 
WORKDIR /var/www

#Copiar archivos de composer para un mejor cacheo
COPY composer.json composer.lock ./

#Instalar dependencias de PHP
RUN composer install --optimize-autoloader --no-scripts

#Copiar los package.json
COPY package*.json ./

#Instalar dependencias de node
RUN npm ci

#Agregar dependencias de React
RUN npm install react react-dom @vitejs/plugin-react

#Copiar el código del proyecto
COPY . .


#Setear permisos
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage

#Exponer puertos
EXPOSE 8000 5173