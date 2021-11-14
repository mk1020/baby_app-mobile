export const dateFormat = (timestamp: number, withTime?: boolean) => {
  const date = new Date(timestamp);
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1;

  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return `${day}.${month}.${date.getFullYear()}` + (withTime ? `, ${hours}:${min}` : '');
};
