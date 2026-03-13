Alla mia web app voglio aggiungere un nuovo modulo, abbastanza a se stante: il fantacalcion.
Si tratta di un fantacalcio con le seguenti regole:

- devi schierare al max un giocatore per ogni squadra di serie A
- il portiere viene schierato in blocco: si scelie una squadra e viene considerato il blocco portieri di quella squadra
- si schierano 11 titolari e 7 riserve (tra le riserve non e' considerato il portiere perche' e' in blocco, come accennato prima)
- due squadre rimangono fuori

Vorrei un modulo della mia web app che mi metta adisposizione le seguenti funzionalita:

- l'utente puo' inserire la formazione in un modo molto simile alle app di fantacalcio:
  1.  il sistema richiede la formazione in input
  2.  sulla base della formazione il sistema disegna un campo di calcio, schierando i giocatori (iniziamente saranno dei placeholder).
  3.  L'utente puo' cliccare su un giocatore placeholder e scegliere un giocatore tra quelli disponibili. La disponibilita' di un giocatore segue le regole sopra menzionate.
      - se si clicca su un portiere, viene proposto un dropdown di squadre e si sceglie una squadra e si considera il blocco portieri di quella squadra
      - se si clicca su un'altro ruolo, viene proposto un dropdown di giocatori che hanno quel ruolo ma che non sono stati ancora inseriti e la cui squadra non e' ancora stata inserita
- esiste una sezione archivio in cui ci sono tutti i giocatori disponibili e sono filtrabili sulla base del nome, del ruolo e della squadra
  - all'archivio e' possibile aggiungere/modificare/rimuovere i giocatori
- man mano che la formazione viene compilata, in basso e' visibile la lista delle squadre non ancora inserite, e un indicatore di completamento
- quando la formazione e' completa, e' possibile esportarla nella clipboard con formato

```text
4-4-2

Sassuolo
Bastoni (INT)
Bremer (JUV)
Nkounku (ROM)
Romagnoli (LAZ)
Orsolini (BOL)
McTominay (NAP)
Mandragora (FIO)
Nzola (PIS)
Simeone (TOR)
Belotti (CAG)

Panchinaro 1 (SQD)
Panchinaro 2 (SQD)
Panchinaro 3 (SQD)
Panchinaro 4 (SQD)
Panchinaro 5 (SQD)
Panchinaro 6 (SQD)
Panchinaro 7 (SQD)

Out: SQD1, SQD2
```
