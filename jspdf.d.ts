declare module "jspdf" {
  class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string);
    addImage(
      imageData: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    save(filename: string): void;
    addPage(): void;
  }
  export = jsPDF;
}
