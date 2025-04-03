const url = 'https://restcountries.com/v3/all';

const getFlags = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener los datos (Status: ${response.status})`);
    }
    const data = await response.json();

    // Ordenamos por nombre oficial de forma insensible a mayúsculas
    const dataSort = data.sort((a, b) => {
      const nameA = a.name?.official.toUpperCase() || '';
      const nameB = b.name?.official.toUpperCase() || '';
      return nameA.localeCompare(nameB);
    });

    return dataSort;
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return null;
  }
};

getFlags().then((resultados) => {
  if (!resultados) return;

  const banderaInfo = resultados.map((bandera) => ({
    name: bandera.name?.official || 'N/A',
    flag: bandera.flags[1],
    capital: bandera.capital?.[0] || 'Sin capital',
    population: bandera.population || 0,
    site: bandera.car?.side || 'No especificado',
  }));

  console.log(banderaInfo);

  // Mostramos en HTML
  const cajaPro = document.getElementById('countries-list');
  banderaInfo.forEach((bandera) => {
    cajaPro.innerHTML += `
      <div class="cajaFicha" data-nombre="${bandera.name}" data-detalles-mostrados="false">
        <div class="cajaBandera">
          <img src="${bandera.flag}" alt="Bandera de ${bandera.name}" />
        </div>
        <h3>${bandera.name}</h3>
      </div>
    `;
  });

  // Delegación de eventos en el contenedor principal
  cajaPro.addEventListener('click', function(event) {
    const cajaBanderaElement = event.target.closest('.cajaBandera');
    if (cajaBanderaElement) {
      const cajaFichaElement = cajaBanderaElement.closest('.cajaFicha');
      if (cajaFichaElement) {
        const nombrePais = cajaFichaElement.dataset.nombre;
        const detallesMostrados = cajaFichaElement.dataset.detallesMostrados === 'true';
        const paisSeleccionado = banderaInfo.find(bandera => bandera.name === nombrePais);
        if (paisSeleccionado) {
          mostrarDetallesPais(cajaFichaElement, paisSeleccionado, detallesMostrados);
        }
      }
    }
  });
});

function mostrarDetallesPais(cajaFicha, pais, detallesMostrados) {
  if (detallesMostrados) {
    // Si los detalles ya están mostrados, volvemos al estado original
    cajaFicha.innerHTML = `
      <div class="cajaBandera">
        <img src="${pais.flag}" alt="Bandera de ${pais.name}" />
      </div>
      <h3>${pais.name}</h3>
    `;
    cajaFicha.dataset.detallesMostrados = 'false';
  } else {
    // Si los detalles no están mostrados, los mostramos
    cajaFicha.innerHTML = `
      <div class="cajaBandera">
        <img src="${pais.flag}" alt="Bandera de ${pais.name}" />
      </div>
      <h3>${pais.name}</h3>
      <p>Capital: ${pais.capital}</p>
      <p>Población: ${pais.population.toLocaleString()}</p>
      <p>Lado de conducción: ${pais.site}</p>
    `;
    cajaFicha.dataset.detallesMostrados = 'true';
  }
}