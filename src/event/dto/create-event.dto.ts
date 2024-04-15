export class CreateEventDto {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  date: string;
  categoryId: string[];
  totalTickets?: number;
}
