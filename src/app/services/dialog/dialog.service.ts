import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogOverviewComponent } from '../../components/dialog-overview/dialog-overview.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { TranslateService } from '@ngx-translate/core';

interface DialogData {
    title?: string,
    message?: string,
    showCancel?: boolean
}

@Injectable()
export class DialogService {

    constructor(public dialog: MatDialog, public router: Router, public translateService: TranslateService) {
    }

    openDialog({title, message, showCancel = false}: DialogData) {
        return this.dialog.open(DialogOverviewComponent, {
            data: {title, message, showCancel},
            disableClose: true
        });
    }

    openLoading(message?: string) {
        return this.dialog.open(LoadingComponent, {
            data: {message},
            disableClose: true
        });
    }

    openDialogError(error: any) {
        this.openDialog({title: 'Error', message: this.translateService.instant('error')});
    }

}
