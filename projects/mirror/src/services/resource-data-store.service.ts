import { Injectable } from '@angular/core';
import * as fromCore from '@cxist/mirror-core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ResourceDataStoreService implements fromCore.IResourceDataStore {

    private memoryStore = new Map<string, Array<any>>();
    public constructor() {
        let memoryStoreStr = localStorage.getItem('memoryStore');
        if (!memoryStoreStr) {
            let students = [
                {
                    id: 1,
                    name: '小明',
                    age: 12,
                    remark: '一个帅锅',
                    grade: 'g1',
                    address: '南京东路1号'
                },
                {
                    id: 2,
                    name: '小黑',
                    age: 11,
                    remark: '其实也没有辣么黑',
                    grade: 'g1',
                    address: '江湾体育场2号'
                },
                {
                    id: 3,
                    name: '乐乐',
                    age: 13,
                    remark: '乐观开朗',
                    grade: 'g2',
                    address: '南京东路12号'
                },
                {
                    id: 4,
                    name: '笑笑',
                    age: 12,
                    remark: '有着天使般的笑容',
                    grade: 'g2',
                    address: '南京东路16号'
                },
                {
                    id: 5,
                    name: '小张',
                    age: 14,
                    remark: '很酷,不解释',
                    grade: 'g3',
                    address: '北京1路'
                }
            ];
            this.memoryStore.set('student', students);

            let grades = [
                {
                    id: 'g1',
                    name: '初一',
                    remark: '萌新'
                },
                {
                    id: 'g2',
                    name: '初二',
                    remark: '逗比'
                },
                {
                    id: 'g3',
                    name: '初三',
                    remark: '大佬'
                }
            ];
            this.memoryStore.set('grade', grades);
        } else {
            let map: { [key: string]: Array<any> } = JSON.parse(memoryStoreStr);
            let keys = Object.keys(map);
            keys.forEach(k => {
                this.memoryStore.set(k, map[k]);
            });
        }
    }

    public get<T = any>(resource: string, id: string): Observable<T> {
        let items = this.memoryStore.get(resource) || [];
        let entity = items.filter(x => x.id === id)[0];
        return of(fromCore.ObjectTool.deepCopy(entity));
    }

    public query<T = any>(resource: string, queryParam?: any): Observable<fromCore.IQueryResult<T>> {
        let items = this.memoryStore.get(resource) || [];
        let datas = fromCore.ObjectTool.deepCopy(items);
        if (resource === 'student') {
            let grades = this.memoryStore.get('grade') || [];
            datas.forEach(s => {
                let g = grades.filter(x => x.id === s.grade)[0];
                s['gradeName'] = g.name;
            });
            if (queryParam && queryParam.grade) {
                let { grade } = queryParam;
                return of({ items: datas.filter(x => x.grade === grade) });
            }
        }

        return of({ items: datas });
    }

    public create<T = any>(resource: string, entity: T): Observable<T> {
        let data = fromCore.ObjectTool.deepCopy(entity);
        let items = this.memoryStore.get(resource) || [];
        data['id'] = items.length + 1;
        items.push(data);
        this.persistentStore();
        return of(data);
    }

    public patch<T = any>(resource: string, id: string, entity: any): Observable<T> {
        let items = this.memoryStore.get(resource) || [];
        let index = items.findIndex(x => x.id === id);
        items[index] = entity;
        this.memoryStore.set(resource, items);
        this.persistentStore();
        return of(entity);
    }

    private persistentStore(): void {
        let map = {};
        this.memoryStore.forEach((arr, key) => {
            map[key] = arr;
        });
        localStorage.setItem('memoryStore', JSON.stringify(map));
    }
}
