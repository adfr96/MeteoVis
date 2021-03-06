# MeteoVis

Visualization based on d3.js for Meteo data

Il lavoro svolto ha riguardato ESPERIMENTI DI VISUALIZZAZIONI DI DATI MULTIVARIATI SU MAPPA.<br/>
I dati utilizzati sono dati meteorologici, in particolare raggruppati per provincia sul territorio Italiano. In particolare tali dati sono stati raccolti nel periodo di Luglio, quindi contengono informazioni relativamente a questo periodo.

Per ciascuna provincia si hanno informazioni circa:<br/>
-Pioggia nell'ultima ora (caduta nella provincia)<br/>
-Venti per ciascuna ora del giorno (velocità massima m/sec del vento e direzione)<br/>
-Pressione per ciascuna ora del giorno (in hPa)  <br/>
-Umidità per ciascuna ora del giorno (in percentuale)<br/>

Rispetto a tali informazioni abbiamo realizzato una visualizzazione che consenta di vedere sempre fino a due scalari contemporaneamente nella mappa.<br/>
Potendo scegliere quali scalari combinare tra loro. Lo scalare principale è rappresentato dal colore, mentre il secondo valore scalare è mappato da diversi pattern a seconda dell'informazione rappresentata. 

In particolare:<br/>
-Pressione: Quadrati e cerchi per rappresentare rispettivamente bassa e alta pressione. L'alta pressione si verifica sopra una certa soglia, la bassa pressione al di sotto di un'altra soglia<br/>
-Direzione venti: le frecce indicano la direzione in gradi del vento<br/>
-Umidità: rappresentate da un piechart che indica la percentuale di umidità presente<br/>

Osservazione: per quanto riguarda la rappresentazione della direzione del vento, alcune volte per la stessa provincia ci sono due rappresentazioni diverse, ma ciò è dovuto ad un'incongruenza nei file json dei dati, che presentano due valori diversi per la stessa provincia nella nella stessa ora per il vento, cosa che non dovrebbe accadere.

