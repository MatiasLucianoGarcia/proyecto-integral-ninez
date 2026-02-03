export function sortByDateDesc<T>(items: T[], dateField: keyof T = 'fecha_real' as keyof T): T[] {
    return [...items].sort((a, b) => {
        const dateA = a[dateField] ? new Date(a[dateField] as any).getTime() : 0;
        const dateB = b[dateField] ? new Date(b[dateField] as any).getTime() : 0;

        // If sorting by generic date field fails or is 0, try fallback to fecha_carga if it exists on the type
        const valA = dateA > 0 ? dateA : (a['fecha_carga' as keyof T] ? new Date(a['fecha_carga' as keyof T] as any).getTime() : 0);
        const valB = dateB > 0 ? dateB : (b['fecha_carga' as keyof T] ? new Date(b['fecha_carga' as keyof T] as any).getTime() : 0);

        return valB - valA;
    });
}
