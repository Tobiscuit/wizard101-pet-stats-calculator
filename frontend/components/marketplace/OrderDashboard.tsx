"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getMyOrders, updateOrderStatus } from "@/services/marketplace-service";
import { MarketOrder } from "@/types/firestore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, MessageSquare, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrderDashboard() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<MarketOrder[]>([]);
    
    // Reschedule State
    const [rescheduleOrder, setRescheduleOrder] = useState<string | null>(null);
    const [delayMinutes, setDelayMinutes] = useState("15");

    useEffect(() => {
        if (session?.user?.id) loadOrders();
    }, [session]);

    async function loadOrders() {
        if (!session?.user?.id) return;
        const data = await getMyOrders(session.user.id);
        const active = data.filter(o => !['completed', 'cancelled', 'expired'].includes(o.status));
        setOrders(active);
    }

    async function handleStatus(order: MarketOrder, status: MarketOrder['status'], msg?: string) {
        if (!session?.user?.id) return;
        try {
           await updateOrderStatus(order.id, status, msg);
           loadOrders();
        } catch (e) {
            console.error(e);
        }
    }

    async function handleReschedule() {
        if (!rescheduleOrder) return;
        const futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + parseInt(delayMinutes));
        
        await updateOrderStatus(rescheduleOrder, 'busy', `Suggesting delay of ${delayMinutes}m`, futureDate);
        setRescheduleOrder(null);
        loadOrders();
    }

    if (orders.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-h-[80vh] overflow-y-auto">
            {orders.map(order => {
                const isBuyer = order.buyerId === session?.user?.id;
                const isSeller = order.sellerId === session?.user?.id;
                
                return (
                    <Card key={order.id} className="shadow-2xl border-accent-gold/50 animate-in slide-in-from-right-4">
                        <CardHeader className="p-4 pb-2 bg-muted/50">
                            <div className="flex justify-between items-center">
                                <Badge variant={getStatusVariant(order.status)} className="uppercase">
                                    {order.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {isBuyer ? 'Buying from' : 'Selling to'} {isBuyer ? order.sellerId : order.buyerId}
                                </span>
                            </div>
                            <CardTitle className="text-sm mt-1">
                                {order.amount}x Item (Total: {order.totalPrice} {order.currency})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 py-2 space-y-2">
                             {/* Timer */}
                             {order.status === 'processing' && order.expiresAt && (
                                <div className="bg-red-500/10 text-red-500 p-2 rounded flex items-center justify-center font-mono font-bold">
                                    <Clock className="w-4 h-4 mr-2 animate-pulse" />
                                    {new Date(order.expiresAt.seconds * 1000).toLocaleTimeString([], {minute: '2-digit', second:'2-digit'})} remaining
                                </div>
                             )}

                             {/* Busy / Proposed Time */}
                             {order.status === 'busy' && order.proposedTime && (
                                <div className="bg-yellow-500/10 text-yellow-600 p-2 rounded text-sm">
                                    <strong>Reschedule Proposed:</strong><br/>
                                    {new Date(order.proposedTime.seconds * 1000).toLocaleTimeString()}
                                    
                                    {isBuyer && (
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatus(order, 'scheduled', 'Accepted time.')}>
                                                Accept
                                            </Button>
                                             <Button size="sm" variant="ghost" className="w-full text-red-500" onClick={() => handleStatus(order, 'cancelled')}>
                                                Decline
                                            </Button>
                                        </div>
                                    )}
                                </div>
                             )}
                             
                             {/* Scheduled - Ready Check */}
                             {order.status === 'scheduled' && (
                                <div className="bg-blue-500/10 text-blue-500 p-2 rounded text-center">
                                    Confirmed for {order.scheduledTime ? new Date(order.scheduledTime.seconds * 1000).toLocaleTimeString() : 'Later'}.
                                    <Button size="sm" className="w-full mt-2" onClick={() => handleStatus(order, 'processing', 'Started early.')}>
                                        I&apos;m Ready Now
                                    </Button>
                                </div>
                             )}

                             {/* Location */}
                             {['processing', 'scheduled'].includes(order.status) && (
                                <div className="text-xs flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-3 h-3" /> Realm Wu, The Commons
                                </div>
                             )}
                        </CardContent>
                        <CardFooter className="p-2 bg-muted/20 flex gap-2">
                             {/* Actions based on Status & Role */}
                             {order.status === 'pending' && isSeller && (
                                <>
                                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatus(order, 'processing')}>
                                        Accept Ping
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild><Button size="sm" variant="outline" onClick={() => setRescheduleOrder(order.id)}>Busy?</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Propose New Time</DialogTitle>
                                            <DialogDescription>Let the buyer know when you'll be free.</DialogDescription>
                                            <Select value={delayMinutes} onValueChange={setDelayMinutes}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">In 5 mins</SelectItem>
                                                    <SelectItem value="15">In 15 mins</SelectItem>
                                                    <SelectItem value="30">In 30 mins</SelectItem>
                                                    <SelectItem value="60">In 1 hour</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <DialogFooter>
                                                <Button onClick={handleReschedule}>Send Proposal</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                             )}
                             
                             {order.status === 'processing' && (
                                <Button size="sm" className="w-full" onClick={() => handleStatus(order, 'completed')}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Confirm Trade
                                </Button>
                             )}
                             
                             <Button size="icon" variant="ghost" className="h-8 w-8 ml-auto" title="Cancel" onClick={() => handleStatus(order, 'cancelled')}>
                                <XCircle className="w-4 h-4 text-red-500" />
                             </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch(status) {
        case 'processing': return 'destructive'; // Urgent (Red/Timer)
        case 'completed': return 'default'; // Green
        case 'pending': return 'secondary'; // Yellow-ish
        case 'busy': return 'outline';
        case 'scheduled': return 'outline';
        default: return 'outline';
    }
}
