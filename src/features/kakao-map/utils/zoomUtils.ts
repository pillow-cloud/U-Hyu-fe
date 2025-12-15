export const getSearchRadiusByZoomLevel = (zoomLevel: number): number => {
  if (zoomLevel <= 4) return 1000;
  if (zoomLevel <= 5) return 2000;
  if (zoomLevel <= 6) return 4000;
  if (zoomLevel <= 7) return 8000;
  if (zoomLevel <= 8) return 20000;
  return 20000;
};

/**
 * AI가 제안한 반경(m)을 가장 적절한 줌 레벨로 변환하는 헬퍼 함수
 * @param radius 미터 단위 반경
 */
export const getZoomLevelByRadius = (radius: number): number => {
  // 정의된 반경 매핑 (getSearchRadiusByZoomLevel 역산)
  // 4: 1000m, 5: 2000m, 6: 4000m, 7: 8000m, 8: 20000m
  const levels = [
    { level: 4, radius: 1000 },
    { level: 5, radius: 2000 },
    { level: 6, radius: 4000 },
    { level: 7, radius: 8000 },
    { level: 8, radius: 20000 },
  ];

  // 가장 차이가 적은 레벨 찾기
  const best = levels.reduce((prev, curr) => {
    return Math.abs(curr.radius - radius) < Math.abs(prev.radius - radius)
      ? curr
      : prev;
  });

  return best.level;
};
