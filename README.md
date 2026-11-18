# StockControl

Aplicación web estática para el control de stock (HTML, CSS y JavaScript).

**Autor:** Carlos Esteban Iglesias

## Contenido del proyecto

| Archivo      | Descripción                                |
|--------------|--------------------------------------------|
| `index.html` | Estructura de la página                    |
| `styles.css` | Estilos                                    |
| `app.js`     | Lógica del inventario                      |
| `Dockerfile` | Imagen basada en Nginx para servir la app  |

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado y en ejecución.

## Construir la imagen Docker

Desde la carpeta raíz del proyecto (donde está el `Dockerfile`):

```bash
docker build -t stockcontrol .
```

## Iniciar el contenedor

```bash
docker run -d --name stockcontrol -p 8080:80 stockcontrol
```

Luego abre en el navegador: <http://localhost:8080>

## Comandos útiles

```bash
docker ps                  # Ver contenedores en ejecución
docker logs stockcontrol   # Ver los logs
docker stop stockcontrol   # Detener el contenedor
docker rm stockcontrol     # Eliminar el contenedor
```

## Ejecución sin Docker

Basta con abrir `index.html` directamente en el navegador.
