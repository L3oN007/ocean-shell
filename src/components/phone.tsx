import { cn } from "@/lib/utils"

interface PhoneProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
  className?: string
}

const Phone = ({ className, imgSrc, dark = false, ...props }: PhoneProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <img
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        alt="phone img"
        className="pointer-events-none z-50 select-none"
      />

      <div className="absolute inset-0 -z-10">
        <img src={imgSrc} alt="overlay phone img" className="object-cover" />
      </div>
    </div>
  )
}

export default Phone
