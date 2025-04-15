'use client'
import { login } from "@/actions/login"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useActionState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
    login: z
        .string()
        .min(4, { message: "Username must contain at least 3 characters" })
        .max(16, { message: "Username must contain at most 16 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
    password: z
        .string()
        .min(6, { message: "Password must contain at least 6 characters" })
        .max(20, { message: "Password must contain at most 20 characters." }),
})
export const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [state, action] = useActionState(login, null)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append('login', values.login)
        formData.append('password', values.password)

        startTransition(() => {
            action(formData)
        });
    }

    useEffect(() => {
        if (state?.success === false) {
            toast.error(state?.message)
            return;
        }
        if (state?.success === true) {
            redirect('/')
        }
    }, [state])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[320px] flex flex-col p-4 border gap-2.5 rounded-lg">
                <FormField control={form.control} name="login" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="Place your username" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs w-full" />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Place your password" type="password" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs w-full" />
                    </FormItem>
                )} />
                <Button type="submit">Login</Button>
                <p className="text-xs text-center text-muted-foreground">
                    or{" "}
                    <Link
                        href="/signup"
                        className="text-primary underline transition underline-offset-2"
                    >
                        create an account
                    </Link>
                </p>
            </form>

        </Form>
    )
}