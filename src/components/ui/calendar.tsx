import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  useDayPicker,
  useDayRender,
  type DayProps,
  type WeekNumberProps,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "buttons",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-nav_button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-nav_button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthCaption: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-4 md:flex-row",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
        nav_button: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
        ),
        caption:
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
        caption_dropdowns:
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
        dropdown_month:
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
        dropdown_year:
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
        dropdown: "bg-popover absolute inset-0 opacity-0",
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "buttons"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5"
        ),
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
        row: "mt-2 flex w-full",
        weeknumber: "text-muted-foreground select-none text-[0.8rem]",
        cell: "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child:has([aria-selected])_button]:rounded-l-md [&:last-child:has([aria-selected])_button]:rounded-r-md [&:has([data-range-start=true])]:bg-accent [&:has([data-range-start=true])]:rounded-l-md [&:has([data-range-end=true])]:bg-accent [&:has([data-range-end=true])]:rounded-r-md",
        vhidden: "sr-only",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeftIcon className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRightIcon className={cn("size-4", className)} {...props} />
        ),
        IconDropdown: ({ className, ...props }) => (
          <ChevronDownIcon className={cn("size-4", className)} {...props} />
        ),
        Day: CalendarDay,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDay({ displayMonth, date }: DayProps) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const { activeModifiers, buttonProps, divProps, isButton, isHidden } =
    useDayRender(date, displayMonth, ref)

  if (isHidden) {
    return <></>
  }

  if (!isButton) {
    return (
      <div
        {...divProps}
        className={cn(
          "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none [&>span]:text-xs [&>span]:opacity-70",
          activeModifiers.outside && "text-muted-foreground",
          divProps.className
        )}
      />
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-day={date.toLocaleDateString()}
      data-outside={activeModifiers.outside}
      data-selected-single={
        activeModifiers.selected &&
        !activeModifiers.range_start &&
        !activeModifiers.range_end &&
        !activeModifiers.range_middle
      }
      data-range-start={activeModifiers.range_start}
      data-range-end={activeModifiers.range_end}
      data-range-middle={activeModifiers.range_middle}
      data-today={activeModifiers.today}
      {...buttonProps}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[today=true]:bg-accent data-[today=true]:text-accent-foreground data-[outside=true]:text-muted-foreground focus:border-ring focus:ring-ring/50 disabled:text-muted-foreground flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[today=true]:rounded-md focus:relative focus:z-10 focus:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        buttonProps.className
      )}
      ref={ref}
    />
  )
}

function CalendarWeekNumber({ number }: WeekNumberProps) {
  const { classNames, formatters } = useDayPicker()

  return (
    <span className={classNames.weeknumber}>
      <div className="flex size-[--cell-size] items-center justify-center text-center">
        {formatters.formatWeekNumber(number)}
      </div>
    </span>
  )
}

export { Calendar, CalendarDay }
