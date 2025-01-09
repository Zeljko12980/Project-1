# README

## .NET React Web Aplikacija za Prodaju Kompjuterske Opreme

Ova aplikacija omogućava korisnicima da pregledaju i kupe različitu kompjutersku opremu. Aplikacija je podeljena na dva dela:

1. **Backend (API)** - Implementiran korišćenjem .NET Core tehnologije.
2. **Frontend (React)** - Razvijen korišćenjem React biblioteke sa Tailwind CSS i Vite.js za stilizaciju i brzo učitavanje.

---

## Struktura Projekta

- **`/api`** - Folder koji sadrži backend aplikaciju.
- **`/client`** - Folder koji sadrži frontend aplikaciju.

---

## Preduslovi

Pre nego što pokrenete aplikaciju, uverite se da imate sledeće alate instalirane na svom računaru:

1. **Node.js**  
   [Preuzmi Node.js](https://nodejs.org/)
2. **.NET SDK** 
   [Preuzmi .NET SDK](https://dotnet.microsoft.com/download)
3. **Git** (za kloniranje repozitorijuma)  
   [Preuzmi Git](https://git-scm.com/)

---

## Instalacija i Pokretanje

### 1. Kloniranje Repozitorijuma

```bash
git clone https://github.com/Zeljko12980/Projekat-1

```

### 2. Pokretanje Backenda (API)

1. Pređite u `api` folder:

    ```bash
    cd api
    ```

2. Pokrenite aplikaciju:

    ```bash
    dotnet watch run
    ```

   Backend će biti dostupan na `http://localhost:5157` (ili drugom konfigurisanom portu).

### 3. Pokretanje Frontenda (React)

1. Pređite u `client` folder:

    ```bash
    cd client
    ```

2. Instalirajte potrebne pakete:

    ```bash
    npm install
    ```

3. Pokrenite frontend aplikaciju:

    ```bash
    npm run dev
    ```

   Frontend će biti dostupan na `http://localhost:5173` (ili drugom konfigurisanom portu).

---

## Tehnologije

### Backend

- **.NET Core**
- **Entity Framework Core** - ORM za rad sa bazom podataka
- **JWT** - Za autentifikaciju i autorizaciju
- **Swagger** - Za dokumentaciju API-ja

### Frontend

- **React.js** - Biblioteka za korisnički interfejs
- **Tailwind CSS** - Alat za stilizaciju
- **Vite.js** - Brzo učitavanje aplikacije

---

## Razvoj i Testiranje

- **Za backend**, svi endpointi mogu se testirati pomoću Swagger-a na `http://localhost:5000/swagger`.  
- **Za frontend**, aplikacija se automatski osvežava prilikom promena zahvaljujući Vite.js.

---

## Deployment

Detalji o deployment-u nisu uključeni u ovaj README. Obavezno podesite baze podataka i konfiguraciju za produkcionu sredinu pre objavljivanja.

---

## Kontakt

Za dodatne informacije ili pitanja, obratite se na [ikanoviczeljko095@gmail.com].

