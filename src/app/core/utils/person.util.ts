export function personFirstName(name: string): string {
  return name.split(' ')[0] ?? name;
}
