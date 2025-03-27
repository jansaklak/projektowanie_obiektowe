program Zadanie3;

uses crt, sysutils;

const
  ROZMIAR = 50;

type
  Tablica = array[1..ROZMIAR] of integer;

var
  liczby: Tablica;

procedure Generator(var tab: Tablica);
var
  i: integer;
begin
  Randomize;
  for i := 1 to ROZMIAR do
    tab[i] := Random(101);
end;

procedure BubbleSort(var tab: Tablica);
var
  i, j, temp: integer;
begin
  for i := 1 to ROZMIAR - 1 do
    for j := 1 to ROZMIAR - i do
      if tab[j] > tab[j + 1] then
      begin
        temp := tab[j];
        tab[j] := tab[j + 1];
        tab[j + 1] := temp;
      end;
end;

procedure WyswietlTablice(tab: Tablica);
var
  i: integer;
begin
  for i := 1 to ROZMIAR do
    Write(tab[i], ' ');
  Writeln;
end;

begin
  ClrScr;
  Generator(liczby);
  
  Writeln('Wygenerowane liczby:');
  WyswietlTablice(liczby);
  
  BubbleSort(liczby);
  
  Writeln('Posortowane liczby:');
  WyswietlTablice(liczby);
  
  ReadLn;
end.
