# K6 Sequential

Este repositório é responsável por enviar mensagens para uma api de forma sequencial, sem duplicidade e em alta performance usando o k6. Para utilizar este script, basta inserir as informações necessárias no arquivo CSV e seguir os passos abaixo para configurar o ambiente e executar o envio das mensagens para o tópico.

## Instalando o k6 

### Mac OS

`````
brew install k6
`````
### Windows 

`````
choco install k6
`````

ou

`````
winget install k6 --source winget
`````


## Scripts k6 e estrutura CSV


- Para a execução do script ***k6_sequential_sender.js*** a estrutura do CSV `data.csv` abaixo a ser considerada: 
`````
"document","infoId","subInfoId","anyNumber","xValue","yValue","zValue","floatNumber","string"
`````

## Performance

Esse script garante que as mensagens não serão duplicadas e caso haja algum cpf com menos de 11 posições ele corrige os zeros a esquerda. A performance do script é 1,5 milhão de mensagens por hora, 25 mil mensagens por minuto. 

## Configurando antes de executar

Informe no script o número de linhas que tem o csv antes de realizar a execução. Se o csv possuir 100 mil linhas vc deve informar como no exemplo abaixo: 

`````
const numLines = 100000;
`````

## Executando o script 

`````
k6 run k6_sequential_sender.js
`````
