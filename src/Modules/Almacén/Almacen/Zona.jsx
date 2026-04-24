import SeccionAlmacen from "./Section";

const ZonaAlmacen = ({ zona, ubicaciones, onclick, totalCols = 20, totalRows = 21 }) => {
  // Guard: si zona no está lista aún, no renderizar
  if (!zona || !zona.racks?.length) return null;

  const calcularDimensiones = () => {
    if (zona.orientacion === "HORIZONTAL") {
      const maxSecciones = Math.max(...zona.racks.map((r) => r.seccionesPorNivel));
      const anchoTotal = 1 + maxSecciones;
      const altoTotal = 1 + zona.racks.reduce((acc, r) => acc + r.niveles + 1, 0);
      return { anchoTotal, altoTotal };
    } else {
      const anchoTotal = zona.racks.reduce((acc, r) => acc + r.niveles + 1, 0) + 1;
      const maxSecciones = Math.max(...zona.racks.map((r) => r.seccionesPorNivel));
      const altoTotal = 2 + maxSecciones;
      return { anchoTotal, altoTotal };
    }
  };

  const { anchoTotal, altoTotal } = calcularDimensiones();

  const offsetX = Math.max(1, Math.floor((totalCols - anchoTotal) / 2) + 1);
  const offsetY = Math.max(1, Math.floor((totalRows - altoTotal) / 2) + 1);

  const etiquetaZona =
    zona.orientacion === "HORIZONTAL" ? (
      <div
        key={`zona-${zona._id}`}
        className="text-[17px] font-semibold flex items-center justify-center text-white bg-sky-500"
        style={{
          gridColumnStart: offsetX,
          gridRowStart: offsetY,
          gridColumnEnd: offsetX + anchoTotal,
          gridRowEnd: offsetY + 1,
        }}
      >
        {zona.nombre}
      </div>
    ) : (
      <div
        key={`zona-${zona._id}`}
        className="text-[17px] font-semibold flex items-center justify-center text-white bg-sky-500"
        style={{
          gridColumnStart: offsetX + 1,
          gridRowStart: offsetY,
          gridColumnEnd: offsetX + anchoTotal - 1,
          gridRowEnd: offsetY + 1,
        }}
      >
        {zona.nombre}
      </div>
    );

  let acumuladorY = offsetY + 1;

  const renderRack = (rack, rackIndex) => {
    const niveles = rack.niveles;
    const seccionesPorNivel = rack.seccionesPorNivel;

    const rackOffsetX =
      zona.orientacion === "HORIZONTAL"
        ? offsetX + 1
        : offsetX + 1 + rackIndex * (niveles + 1);

    const rackOffsetY =
      zona.orientacion === "HORIZONTAL"
        ? acumuladorY
        : offsetY + 2;

    if (zona.orientacion === "HORIZONTAL") {
      acumuladorY += niveles + 1;
    }

    const celdas = [];

    for (let nivelIdx = 0; nivelIdx < niveles; nivelIdx++) {
      for (let seccionIdx = 0; seccionIdx < seccionesPorNivel; seccionIdx++) {
        const nivel = nivelIdx + 1;
        const seccion = seccionIdx + 1;

        const x =
          zona.orientacion === "HORIZONTAL"
            ? rackOffsetX + seccionIdx
            : rackOffsetX + nivelIdx;

        const y =
          zona.orientacion === "HORIZONTAL"
            ? rackOffsetY + nivelIdx
            : rackOffsetY + seccionIdx;

        const ubicacion = ubicaciones.find(
          (u) =>
            String(u.zonaId?._id) === String(zona._id) &&
            u.rack === rack.nombre &&
            u.nivel === nivel &&
            u.seccion === seccion
        );

        celdas.push(
          <div
            key={`rack-${rack.nombre}-${nivel}-${seccion}`}
            style={{ gridColumnStart: x, gridRowStart: y }}
          >
            <SeccionAlmacen
              nivel={nivel}
              seccion={seccion}
              estado={ubicacion?.estado}
              onclick={() => onclick(ubicacion)}
            />
          </div>
        );
      }
    }

    const etiquetaRack = (
      <div
        key={`rack-label-${rack.nombre}`}
        className="text-[12px] font-semibold flex items-center justify-center text-white bg-gray-800"
        style={{
          gridColumnStart:
            zona.orientacion === "HORIZONTAL" ? rackOffsetX - 1 : rackOffsetX,
          gridRowStart:
            zona.orientacion === "HORIZONTAL" ? rackOffsetY : offsetY + 1,
          gridColumnEnd:
            zona.orientacion === "HORIZONTAL"
              ? rackOffsetX
              : rackOffsetX + niveles,
          gridRowEnd:
            zona.orientacion === "HORIZONTAL"
              ? rackOffsetY + niveles
              : offsetY + 2,
          ...(zona.orientacion === "HORIZONTAL"
            ? { textAlign: "center", writingMode: "sideways-lr" }
            : {}),
        }}
      >
        {rack.nombre}
      </div>
    );

    return [etiquetaRack, ...celdas];
  };

  return (
    <>
      {etiquetaZona}
      {zona.racks.flatMap((rack, idx) => renderRack(rack, idx))}
    </>
  );
};

export default ZonaAlmacen;