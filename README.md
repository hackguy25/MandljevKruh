# MandljevKruh

Počitniški projekt, ustvarjen z namenom spoznavanja programskega jezika JavaScript in grafične knjižnice p5.js.
Spletna stran ustvari nov canvas velikosti okna in za vsak piksel tega canvasa 4x izračuna število ponovitev, ki so potrebne, da lahko določimo, ali vrednost v vsaki točki divergira. Povprečje teh vrednosti določa svetlost piksla - manj ponovitev, temnejši piksel, če piksel ne divergira, ostaja črn.

POZOR! Večje, kot je okno, zahtevnejši je postopek izrisa - v oknu velikost 1920 * 1080 pikslov, na primer, za 500 iteracij potrebujemo s procesorjem Core i7 za izris približno 3 minute in do 1,5 GB pomnilnika. Priporočam uporabo 64-bitnih brskalnikov.

Po sliki se lahko pomikamo s pomočjo koleščka:
 - Za povečavo pomaknemo kazalec miške na del slike, ki ga želimo centrirati, in pomaknemo kolešček za 1 položaj naprej.
 - Za pomanjšavo pomaknemo kazalec miške na del slike, ki ga želimo centrirati, in pomaknemo kolešček za 1 položaj nazaj.

Za dodatne informacije lahko pritisnete na tipko F12 med izvajanjem. Po zavihkom "Console" se izpisuje, koliko iteracij je bilo napravljenih in kolikšen del pikslov preostane.
