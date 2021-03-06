import Promise = require("promise");
import {ItemDAO} from "../item-dao";
import {PoolConnection} from "mysql";
import {Item} from "../../../entity/item";

export class ItemDAOImpl implements ItemDAO{

    constructor(private connection: PoolConnection){
    }

    delete(id: String): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connection.query(`DELETE FROM item WHERE code='${id}'`,
                (err, results) => {
                    if(err){
                        reject(err);
                    }else {
                        resolve(results.affectedRows > 0);
                    }
                });

        })
    }

    find(id: String): Promise<Array<Item>> {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM item WHERE code = '${id}'`,
                (err, results) => {
                    if(err){
                        reject(err);
                    }else {
                        resolve(results);
                    }
                });
        });
    }

    findAll(): Promise<Array<Item>> {
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM item`,(err, results) => {
                if(err){
                    reject(err);
                }else {
                    resolve(results);
                }
            });
        });
    }

    save(entity: Item): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connection.query(`INSERT INTO item VALUES ('${entity.code}','${entity.description}','${entity.unitPrice}','${entity.qtyOnHand}')`,
                (err, results) => {
                    if(err){
                        reject(err);
                    }else {
                        resolve(results.affectedRows > 0);
                    }
                });
        });
    }

    update(entity: Item): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connection.query(`UPDATE item SET description='${entity.description}','${entity.unitPrice}','${entity.qtyOnHand}' WHERE itemcode='${entity.code}'`,
                (err, results) => {
                    if(err){
                        reject(err);
                    }else {
                        resolve(results.affectedRows > 0);
                    }
                });
        });
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT COUNT(*) as count FROM item",(err, results) => {
                if(err){
                    reject(err);
                }else {
                    resolve(results[0].count);
                }
            });
        });
    }

}