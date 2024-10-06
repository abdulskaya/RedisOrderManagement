import { AfterCreate, AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { RedisService } from "src/redis/redis.service";
import { OrderService } from "../order.service";

@Table({ tableName: 'order' })
export class Order extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    public id: number;

    @Column
    customerName: string;

    @Column
    orderNumber: string;

    @Column
    item: string;

    @Column
    quantity: number;

    @Column
    status: string;

    @Column
    date: Date;
}