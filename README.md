Esemény jegyértékesítő portál

Telepítési és futtatási útmutató:

A program futtatásához szükséges a docker desktop alkalmazás telepítése.

1. Github repository klónozása,
  szükséges parancs: git clone https://github.com/zato7777/Jegyertekesito.git

2. MongoDB konténer indítása Docker segítségével,
  szükséges parancsok: docker build -t my-mongo-image -f server/Dockerfile .
                       docker run --name my-mongo -p 6000:27017 -d my-mongo-image

3. Adatbázis és példa adatok betöltése a dump mappából,
  szükséges parancs: mongorestore --host localhost --port 6000 --db mongo_db dump/mongo_db

4. Backend szerver telepítése és futtatása,
  szükséges parancsok a gyökér könyvtáron belüli server mappában: npm install
                                                                  npm run start

5. Angular kliens telepítése és futtatása,
  szükséges parancsok a client/jegyertekesito mappában: npm install
                                                        ng serve

Az útmutató lépéseinek végrehajtása után a szerver elérhető a http://localhost:5000/app oldalon.
A frontend alkalmazás a http://localhost:4200/events alatt.
