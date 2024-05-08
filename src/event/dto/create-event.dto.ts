export class CreateEventDto {
  title: string;
  description: string;
  link?: string;
  date: string;
  imageUrl: string;
  categoriesId: string[];
  totalTickets?: number;
}
