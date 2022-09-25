import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
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

        const source = timer(3000);
        source.subscribe(() => {
            loading.close();
        });

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe(this.topic, onMessageReceivedFunction);
        }, this.errorCallBack);
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
