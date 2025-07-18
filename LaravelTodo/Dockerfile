# Start your image with a node base image
FROM php:8.2

# Install necessary packages
RUN apt-get update -y \
    && apt-get install -y openssl zip unzip git libicu-dev zlib1g-dev libzip-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo intl zip

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer 
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install application dependencies
RUN composer install

# Command to run the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8181"]

# Expose port 8181
EXPOSE 8181