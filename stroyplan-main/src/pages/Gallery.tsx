import { useState } from "react";
import { Link } from "react-router-dom";
import { Grid3X3, ArrowRight, Search, Filter } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const projects = [
  { id: 1, title: "Студия 35м²", rooms: "1 комната", area: 35, type: "studio" },
  { id: 2, title: "Однушка 42м²", rooms: "1 комната", area: 42, type: "1room" },
  { id: 3, title: "Двушка 54м²", rooms: "2 комнаты", area: 54, type: "2room" },
  { id: 4, title: "Двушка 62м²", rooms: "2 комнаты", area: 62, type: "2room" },
  { id: 5, title: "Трёшка 78м²", rooms: "3 комнаты", area: 78, type: "3room" },
  { id: 6, title: "Трёшка 85м²", rooms: "3 комнаты", area: 85, type: "3room" },
  { id: 7, title: "Квартира 92м²", rooms: "4 комнаты", area: 92, type: "4room" },
  { id: 8, title: "Квартира 110м²", rooms: "4+ комнаты", area: 110, type: "4room" },
];

const filters = [
  { id: "all", label: "Все" },
  { id: "studio", label: "Студии" },
  { id: "1room", label: "1 комната" },
  { id: "2room", label: "2 комнаты" },
  { id: "3room", label: "3 комнаты" },
  { id: "4room", label: "4+ комнаты" },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = activeFilter === "all" || project.type === activeFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Галерея проектов
            </h1>
            <p className="text-lg text-muted-foreground">
              Готовые шаблоны планировок для разных типов квартир. 
              Выберите подходящий и адаптируйте под свои нужды.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  className={activeFilter === filter.id ? "btn-primary" : ""}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to="/editor"
                className="card-elevated group overflow-hidden animate-fade-up"
              >
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                  <Grid3X3 className="h-16 w-16 text-muted-foreground/20" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-background/80 text-xs font-medium">
                    {project.area}м²
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.rooms}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Grid3X3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Проекты не найдены</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Не нашли подходящий шаблон?
            </h2>
            <p className="text-muted-foreground mb-6">
              Создайте план квартиры с нуля в нашем редакторе
            </p>
            <Link to="/editor">
              <Button size="lg" className="btn-primary">
                Создать новый проект
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
