# README

## .NET React Web Aplikacija za Prodaju Kompjuterske Opreme

Ova aplikacija omogućava korisnicima da pregledaju i kupe različitu kompjutersku opremu. Aplikacija je podeljena na dva dela:

1. **Backend (API)** - Implementiran korišćenjem .NET Core tehnologije.
2. **Frontend (React)** - Razvijen korišćenjem React biblioteke sa Tailwind CSS i Vite.js za stilizaciju i brzo učitavanje.

---

## Video
https://youtu.be/97SiT_Zq4mI

---

## Slike

<img width="941" alt="image" src="https://github.com/user-attachments/assets/c9b64f06-796c-4dcb-a01b-e09b5fc9926c" />
<img width="949" alt="image" src="https://github.com/user-attachments/assets/7b7190f3-555c-4a57-a236-3cfa73345a46" />
<img width="591" alt="image" src="https://github.com/user-attachments/assets/c86c4169-86ca-4c03-8a9e-03145572693f" />
<img width="414" alt="image" src="https://github.com/user-attachments/assets/fac2f05c-cefb-4f6a-9a2c-1494b9bf8e56" />
<img width="391" alt="image" src="https://github.com/user-attachments/assets/fffa6eb4-3855-423d-bd18-64fa71428765" />
<img width="942" alt="image" src="https://github.com/user-attachments/assets/d298ee93-d4b2-4b8d-888f-a68db7669949" />
<img width="223" alt="image" src="https://github.com/user-attachments/assets/c42dc495-e887-4543-a4b1-ca881ce5c5ed" />
<img width="224" alt="image" src="https://github.com/user-attachments/assets/c249a99c-9251-43cc-bed6-7f2024d0f076" />
<img width="579" alt="image" src="https://github.com/user-attachments/assets/c47c3848-de93-4a7a-868e-f2dfc67b15ec" />
<img width="787" alt="image" src="https://github.com/user-attachments/assets/741e72ff-45d7-4ad0-afb6-29b1ebabaafd" />
**WishList
<img width="226" alt="image" src="https://github.com/user-attachments/assets/378c0dab-6e8f-4962-aaab-470b1ed49584" />
<img width="877" alt="image" src="https://github.com/user-attachments/assets/aef6d602-e7fa-403b-ba4a-003e3398a42c" />
<img width="959" alt="image" src="https://github.com/user-attachments/assets/b5f075db-3b0f-4660-b3fc-2652053f3c5f" />
<img width="946" alt="image" src="https://github.com/user-attachments/assets/ececd73e-76ab-4510-8c86-199ebb1cb8ae" />
<img width="948" alt="image" src="https://github.com/user-attachments/assets/d347a941-5233-4add-bf7a-e5f3ed3866aa" />
<img width="949" alt="image" src="https://github.com/user-attachments/assets/0415a94c-14b8-44d6-92d5-da23339475cc" />
<img width="943" alt="image" src="https://github.com/user-attachments/assets/35f5816f-fd9a-4897-980d-6ca28af1089f" />
<img width="940" alt="image" src="https://github.com/user-attachments/assets/3b1273c9-df29-4028-9e72-936c5f185873" />
<img width="947" alt="image" src="https://github.com/user-attachments/assets/dfdf8eb8-1a62-4665-b86e-75344facacd3" />
<img width="944" alt="image" src="https://github.com/user-attachments/assets/43a18dfa-7944-4380-ae38-71feeccfc31a" />
<img width="942" alt="image" src="https://github.com/user-attachments/assets/af32ab8f-ddd9-4b9d-9cc8-492985f4b6c4" />
<img width="949" alt="image" src="https://github.com/user-attachments/assets/1b36d443-00f4-4905-a609-7ff4ee8effd8" />
<img width="944" alt="image" src="https://github.com/user-attachments/assets/57b305ab-9e5b-42f6-82eb-9da07c07a694" />
<img width="941" alt="image" src="https://github.com/user-attachments/assets/01fa9a36-49b2-4428-ae36-442de3b3268b" />
<img width="943" alt="image" src="https://github.com/user-attachments/assets/49b53fee-d536-4b4e-8e54-9fc9f30afd77" />
<img width="950" alt="image" src="https://github.com/user-attachments/assets/ff258ebb-1c93-4402-adce-93c1587345e1" />
<img width="940" alt="image" src="https://github.com/user-attachments/assets/081bc303-428e-40bd-8da1-e8f2bc9a8513" />
<img width="938" alt="image" src="https://github.com/user-attachments/assets/96795b99-d625-44db-9232-f53b2acd1390" />
<img width="197" alt="image" src="https://github.com/user-attachments/assets/b93e55c8-e508-4846-9548-bc17bde65739" />

























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

