import { Card, CardHeader, CardBody } from '@/components/ui/card'

export function Settings() {
  return (
    <Card>
      <CardHeader title="Settings" />
      <CardBody className="text-sm text-zinc-400">
        Theme and preferences arrive in a later phase. The dashboard currently
        uses a fixed dark theme.
      </CardBody>
    </Card>
  )
}
