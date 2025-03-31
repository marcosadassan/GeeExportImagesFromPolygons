# Geração e Exportação de Imagens Sentinel-2 Recortadas em Quadrados a partir de Pontos

Este script do Google Earth Engine (GEE) realiza as seguintes operações:

1.  **Criação de Quadrados a partir de Pontos:**
    * Recebe uma coleção de pontos (`geometry`) e um comprimento de lado (`squareSideLength`).
    * Para cada ponto, cria um quadrado centrado no ponto, com o comprimento de lado especificado.
    * Retorna uma coleção de feições (`ee.FeatureCollection`) contendo os quadrados gerados.

2.  **Mascaramento de Nuvens para Imagens Sentinel-2:**
    * Recebe uma imagem Sentinel-2 (`ee.Image`).
    * Utiliza a banda de qualidade (`QA60`) para identificar e mascarar pixels de nuvens, cirros e sombras de nuvens.
    * Aplica a máscara à imagem e divide os valores dos pixels por 10000 para converter para reflectância.
    * Retorna a imagem mascarada.

3.  **Processamento e Exportação de Imagens Recortadas:**
    * Define o comprimento do lado do quadrado (`squareSideLength`).
    * Cria os quadrados a partir dos pontos usando a função `createSquaresFromPoints`.
    * Filtra e compõe uma imagem mediana Sentinel-2 usando a função `maskS2clouds`, dentro da área dos quadrados e um periodo de tempo definido.
    * Itera sobre cada quadrado na coleção de quadrados:
        * Recorta a imagem mediana para a extensão do quadrado.
        * Exporta a imagem recortada para o Google Drive, na pasta 'cafe', com escala de 10 metros.

4.  **Visualização no Mapa:**
    * Centraliza o mapa na área dos pontos originais.
    * Adiciona os pontos originais e os quadrados gerados como camadas no mapa.

## Funções

* **`createSquaresFromPoints(points, sideLength)`:**
    * Entrada:
        * `points`: Uma coleção de feições de pontos (`ee.FeatureCollection`).
        * `sideLength`: O comprimento do lado dos quadrados a serem criados (`number`).
    * Saída: Uma coleção de feições de quadrados (`ee.FeatureCollection`).

* **`maskS2clouds(image)`:**
    * Entrada: Uma imagem Sentinel-2 (`ee.Image`).
    * Saída: A imagem Sentinel-2 mascarada e dividida por 10000 (`ee.Image`).

## Variáveis

* **`squareSideLength`:** O comprimento do lado dos quadrados em graus decimais.
* **`geometry`:** Uma variável que representa a coleção de pontos de entrada. Deve ser previamente definida no GEE.
* **`squares`:** A coleção de quadrados gerados.
* **`image`:** A imagem mediana Sentinel-2 processada.
* **`featureList`:** A lista de feições de quadrados.
* **`featureCount`:** O número de quadrados.

## Uso

1.  Certifique-se de que a variável `geometry` esteja definida com a coleção de pontos desejada.
2.  Ajuste o valor de `squareSideLength` conforme necessário.
3.  Execute o script no Google Earth Engine.
4.  As imagens recortadas serão exportadas para a pasta 'cafe' no seu Google Drive.
5.  O mapa exibirá os pontos e os quadrados gerados.

## Dependências

* Google Earth Engine API.

## Notas

* O comprimento do lado do quadrado (`squareSideLength`) está em graus decimais.
* A escala de exportação é definida como 10 metros.
* A pasta de exportação é definida como 'cafe' no Google Drive. Certifique-se de que a pasta exista ou altere o nome da pasta no script.
* A filtragem de data da imagem Sentinel-2 pode ser ajustada alterando os parâmetros `filterDate`.
* A variável `geometry` deve ser previamente carregada no script.
