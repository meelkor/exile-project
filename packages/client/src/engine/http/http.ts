import { InjectableGlobal } from '@exile/common/utils/di';
import { mergeMap, Observable } from 'rxjs';

export class Http extends InjectableGlobal {

    public fetch(url: string): Observable<Response> {
        const ac = new AbortController();

        const response$ = new Observable<Response>((sub) => {
            const resPromise = fetch(url, {
                signal: ac.signal,
            });

            resPromise
                .then(res => {
                    if (res.status > 399) {
                        sub.error(new Error(`HTTP error: ${res.status}`));
                    } else {
                        sub.next(res);
                    }
                })
                .catch(err => sub.error(err));

            return () => {
                ac.abort();
            };
        });

        return response$;
    }

    public json<T extends {}>(url: string): Observable<T> {
        return this.fetch(url).pipe(
            mergeMap(res => res.json()),
        );
    }
}

