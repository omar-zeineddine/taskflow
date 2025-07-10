import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/tasks";

export type TaskFilters = {
  search: string;
  assigneeId: string;
  dateFrom: string;
  dateTo: string;
};

type TaskFiltersProps = {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
};

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const { users, fetchUsers } = useTaskStore();
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: TaskFilters = {
      search: "",
      assigneeId: "all",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const clearIndividualFilter = (key: keyof TaskFilters) => {
    const value = key === "assigneeId" ? "all" : "";
    handleFilterChange(key, value);
  };

  const hasActiveFilters
    = localFilters.search || localFilters.assigneeId !== "all" || localFilters.dateFrom || localFilters.dateTo;

  const activeFilterCount = [
    localFilters.search,
    localFilters.assigneeId !== "all" ? localFilters.assigneeId : null,
    localFilters.dateFrom,
    localFilters.dateTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", isExpanded && "rotate-180")} />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-4 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Task Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Tasks</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={localFilters.search}
                  onChange={e => handleFilterChange("search", e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Select
                value={localFilters.assigneeId}
                onValueChange={value => handleFilterChange("assigneeId", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filters */}
            <DateRangePicker
              label="From Date"
              value={localFilters.dateFrom}
              onChange={value => handleFilterChange("dateFrom", value)}
            />

            <DateRangePicker
              label="To Date"
              value={localFilters.dateTo}
              onChange={value => handleFilterChange("dateTo", value)}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active:</span>

          {localFilters.search && (
            <FilterBadge
              label="Tasks"
              value={`"${localFilters.search}"`}
              onRemove={() => clearIndividualFilter("search")}
            />
          )}

          {localFilters.assigneeId && localFilters.assigneeId !== "all" && (
            <FilterBadge
              label="Assignee"
              value={users.find(u => u.id === localFilters.assigneeId)?.name || "Unknown"}
              onRemove={() => clearIndividualFilter("assigneeId")}
            />
          )}

          {localFilters.dateFrom && (
            <FilterBadge
              label="From"
              value={format(new Date(localFilters.dateFrom), "MMM dd, yyyy")}
              onRemove={() => clearIndividualFilter("dateFrom")}
            />
          )}

          {localFilters.dateTo && (
            <FilterBadge
              label="To"
              value={format(new Date(localFilters.dateTo), "MMM dd, yyyy")}
              onRemove={() => clearIndividualFilter("dateTo")}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Reusable Date Picker Component
function DateRangePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? new Date(value) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    }
    else {
      onChange("");
    }
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("h-9 w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
          {selectedDate && (
            <>
              <Separator />
              <div className="p-3">
                <Button variant="ghost" size="sm" onClick={() => handleDateSelect(undefined)} className="w-full">
                  Clear date
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Reusable Filter Badge Component
function FilterBadge({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <span className="text-xs">
        <span className="font-medium">
          {label}
          :
        </span>
        {" "}
        {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}
