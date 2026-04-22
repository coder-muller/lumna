"use client"

import { useState } from "react"
import {
    ComputerIcon,
    MonitorSmartphoneIcon,
    SmartphoneIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"

type FakeSession = {
    id: string
    device: string
    browser: string
    os: string
    isMobile: boolean
    ipAddress: string
    createdAt: string
    updatedAt: string
}

const INITIAL_CURRENT_SESSION: FakeSession = {
    id: "sess_current",
    device: "Desktop",
    browser: "Chrome 124.0",
    os: "macOS 15.0",
    isMobile: false,
    ipAddress: "187.65.12.100",
    createdAt: "2026-04-10T14:32:00.000Z",
    updatedAt: "2026-04-22T09:15:00.000Z",
}

const INITIAL_OTHER_SESSIONS: FakeSession[] = [
    {
        id: "sess_other_1",
        device: "iPhone",
        browser: "Safari 17.5",
        os: "iOS 18.2",
        isMobile: true,
        ipAddress: "187.65.12.101",
        createdAt: "2026-04-18T11:00:00.000Z",
        updatedAt: "2026-04-21T20:30:00.000Z",
    },
    {
        id: "sess_other_2",
        device: "Desktop",
        browser: "Firefox 125.0",
        os: "Windows 11",
        isMobile: false,
        ipAddress: "192.168.1.55",
        createdAt: "2026-04-15T08:45:00.000Z",
        updatedAt: "2026-04-20T17:10:00.000Z",
    },
]

function SessionDeviceIcon({ isMobile }: { isMobile: boolean }) {
    if (isMobile) {
        return <SmartphoneIcon className="mt-0.5 size-4 text-muted-foreground" />
    }
    return <ComputerIcon className="mt-0.5 size-4 text-muted-foreground" />
}

export function SessionsSection() {
    const [otherSessions, setOtherSessions] = useState<FakeSession[]>(
        INITIAL_OTHER_SESSIONS
    )

    function handleRevokeSession(session: FakeSession) {
        setOtherSessions((prev) => prev.filter((s) => s.id !== session.id))
        toast.success("Sessão encerrada")
    }

    function handleRevokeOtherSessions() {
        setOtherSessions([])
        toast.success("Outras sessões encerradas")
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
                {/* Current Session */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Sessão atual</p>
                            <p className="text-xs text-pretty text-muted-foreground">
                                Seu dispositivo atual e a atividade mais recente.
                            </p>
                        </div>
                        <Badge variant="outline">Ativa</Badge>
                    </div>

                    <Separator />

                    <div className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                            <SessionDeviceIcon isMobile={INITIAL_CURRENT_SESSION.isMobile} />
                            <div className="flex min-w-0 flex-1 flex-col gap-4">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium">
                                        {INITIAL_CURRENT_SESSION.device}
                                    </span>
                                    <span className="text-xs text-pretty text-muted-foreground">
                                        {INITIAL_CURRENT_SESSION.os} ·{" "}
                                        {INITIAL_CURRENT_SESSION.browser}
                                    </span>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted-foreground">IP</span>
                                        <span className="text-xs tabular-nums">
                                            {INITIAL_CURRENT_SESSION.ipAddress}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted-foreground">
                                            Criada em
                                        </span>
                                        <span className="text-xs tabular-nums">
                                            {new Date(
                                                INITIAL_CURRENT_SESSION.createdAt
                                            ).toLocaleString("pt-BR")}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-muted-foreground">
                                            Atualizada em
                                        </span>
                                        <span className="text-xs tabular-nums">
                                            {new Date(
                                                INITIAL_CURRENT_SESSION.updatedAt
                                            ).toLocaleString("pt-BR")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Sessions */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Outras sessões</p>
                            <p className="text-xs text-pretty text-muted-foreground">
                                Outros dispositivos conectados à sua conta.
                            </p>
                        </div>

                        {otherSessions.length > 0 ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Encerrar todas
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Encerrar outras sessões</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Isso desconecta sua conta dos outros dispositivos ativos.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleRevokeOtherSessions}>
                                            Encerrar todas
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : null}
                    </div>

                    <Separator />

                    {otherSessions.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {otherSessions.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <SessionDeviceIcon isMobile={item.isMobile} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {item.device}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.os} · {item.browser} · {item.ipAddress}
                                            </p>
                                        </div>
                                    </div>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                Encerrar
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Encerrar sessão</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Essa sessão será removida deste dispositivo.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleRevokeSession(item)}
                                                >
                                                    Encerrar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Empty className="min-h-40 border">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <MonitorSmartphoneIcon />
                                </EmptyMedia>
                                <EmptyTitle>Nenhuma outra sessão</EmptyTitle>
                                <EmptyDescription>
                                    Não há outros dispositivos conectados à sua conta no momento.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    )}
                </div>
            </div>
        </div>
    )
}
