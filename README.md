# **Sistema de Gestión de Ventas para Tienda de Retail**  
Aplicación web desarrollada para automatizar y centralizar las transacciones comerciales de una tienda con presencia nacional. Trabajo realizado para la materia proyecto de software.

---

## **Descripción del Proyecto**  
El sistema permite visualizar productos, realizar ventas múltiples, buscar o filtrar por categorías, y consultar el historial detallado de ventas. Fue desarrollado como una solución moderna y accesible para optimizar los procesos de venta tanto en tiendas físicas como en línea.

---

## **Tecnologías Utilizadas**  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** API REST desarrollada previamente en el [TP2](https://github.com/FiorellaA17/TP2-REST-Adami_Fiorella) para suministrar los datos a la aplicación de frontend.

---

## **1. Página de Inicio**  
Desde la página principal, el usuario accede a las funcionalidades del sistema: visualizar y buscar productos, acceder al carrito y consultar ventas.
Los productos se muestran con su información completa: nombre, imagen, descripción, precio y categoría.
El sistema permite buscar productos por nombre o filtrar por categoría para facilitar la navegación.

![Página de Inicio](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/inicio.png)  
*Figura 1: Vista inicial del sistema. Catálogo con productos listados.*

---

## **2. Detalle del Producto**  
Al hacer clic sobre un producto, se accede a su vista detallada, donde se muestra toda la información relevante: nombre, imagen, precio, descripción y categoría. Además, en esta misma vista se listan productos similares, permitiendo al usuario descubrir otras opciones dentro de la misma categoría o con características relacionadas.

![Detalle del Producto](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/detalle-producto.png)  
*Figura 2: Detalle individual del producto seleccionado y sugerencias relacionadas.*

---

## **3. Carrito de Compras**  
Permite agregar múltiples productos, ver subtotal y total, y confirmar la venta. Se da retroalimentación visual al usuario.

![Carrito](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/carrito.png)  
*Figura 3: Carrito con productos seleccionados.*

![Carrito Vacio](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/carrito-vacio.png)  
*Figura 3.1: Carrito vacio.*

---

## **4. Registro de Ventas**  
Se visualiza un listado de ventas realizadas con posibilidad de filtrarlas por día y/o por ID.

![Historial de Ventas](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/ventas.png)  
*Figura 6: Historial de ventas.*

---

## **5. Detalle de Ventas**  
Al seleccionar una venta específica, se muestran los productos comprados, fecha y monto total.

![Detalle de Venta](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/detalle-venta.png)  
*Figura 5: Detalle de una venta individual.*

---

## **6. Problemas de Carga**  
En ocasiones, si la conexión con la API se demora, el sistema muestra un mensaje claro para que el usuario sepa que debe volver a intentar en unos minutos.

![Error de Carga](https://github.com/FiorellaA17/TP3-UI-Adami_Fiorella/blob/main/error-carga.png)  
*Figura 6: Mensaje de carga demorada.*

---

## **Criterios de Aceptación Cumplidos**  
✅ Interfaz web intuitiva  
✅ Visualización completa de productos  
✅ Posibilidad de realizar ventas múltiples  
✅ Filtros y búsqueda por nombre/categoría  
✅ Historial de ventas filtrable por día  
✅ Detalle de cada venta accesible  
✅ Manejo de errores de carga con mensajes informativos  

---

## **Conclusión**  
Este desarrollo permitió aplicar conceptos clave de diseño web, experiencia de usuario, consumo de APIs REST y control de errores. La aplicación está pensada para escalar con nuevas funcionalidades, como reportes y estadísticas de ventas.
