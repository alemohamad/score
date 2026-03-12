import { REST_PATHS } from "../constants/svgPaths";
import { STAFF_TOP, LINE_GAP, LABEL_Y } from "../constants/staff";

export default function RestHead({ x, duration, selected, dotted, ghost, hideLabel, restLabel }) {
  const color = ghost ? "#a0c4ff" : selected ? "#e63946" : "#1a1a2e";
  const opacity = ghost ? 0.7 : 1;

  const restPath = REST_PATHS[duration] || REST_PATHS.quarter;
  const scale = 0.45;
  const scaledWidth = restPath.width * scale;
  const scaledHeight = restPath.height * scale;

  let restY;
  if (duration === "whole") {
    restY = STAFF_TOP + LINE_GAP - scaledHeight / 2 + 2;
  } else if (duration === "half") {
    restY = STAFF_TOP + LINE_GAP * 2 - scaledHeight / 2 - 2;
  } else {
    restY = STAFF_TOP + LINE_GAP * 2 - scaledHeight / 2;
  }

  const restX = x - scaledWidth / 2;

  return (
    <g opacity={opacity}>
      <g transform={`translate(${restX}, ${restY}) scale(${scale})`}>
        <path d={restPath.path} fill={color} />
      </g>

      {dotted && !ghost && <circle cx={x + scaledWidth / 2 + 6} cy={STAFF_TOP + LINE_GAP * 1.5} r={2.5} fill={color}/>}

      {!hideLabel && (
        <text x={x} y={LABEL_Y} textAnchor="middle" fontSize={10}
          fill={ghost ? "#a0c4ff" : "#1a1a2e"}
          fontFamily="Oldenburg, Georgia, serif">
          {restLabel}
        </text>
      )}
    </g>
  );
}
