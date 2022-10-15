import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { DialogService } from './dialog/dialog.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class WebSocketApiService {
    id!: string;
    topic!: string;
    stompClient: any;
    webSocketEndPoint: string;
    onMessageReceivedFunction!: Function;

    constructor(
        private dialogService: DialogService) {
        this.webSocketEndPoint = `${environment.stompApi}`;
    }
    
    connect(topic: string, id: string, onMessageReceivedFunction: Function) {
        const loading = this.dialogService.openLoading();
        this.id = id;
        this.topic = topic;
        this.onMessageReceivedFunction = onMessageReceivedFunction;

        console.log('Initializing WebSocket Connection...');
        const ws = new SockJS(this.webSocketEndPoint, null);
        this.stompClient = Stomp.over(ws);

        this.stompClient.debug = () => { 
        };
        this.stompClient.connect(environment.security.apiUsername, environment.security.apiPassword, () => {
            console.log('Connected OK');
            loading.close();
            this.stompClient.subscribe(this.topic, onMessageReceivedFunction);
        }, (error: any) => {
            loading.close();
            this.errorCallBack(error);
        });
    }

    send(topic: string, notificationEvent: any) {
        this.stompClient.send(topic, {}, notificationEvent)
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected Websocket Connection.');
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error: any) {
        console.log('errorCallBack -> ' + error);
        const _this = this;
        setTimeout(() => {
            _this.connect(this.topic, this.id, this.onMessageReceivedFunction);
        }, 5000);
    }
}
