import { AfterViewInit, Component } from '@angular/core';
import { fadeInRightAnimation } from 'src/app/core/fade-in-right.animation';

type CasinoStatus = 'ONLINE' | 'OFFLINE';

interface Casino {
  id: number;
  name: string;
  client: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: CasinoStatus;
  updatedAt: string;
}


declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss'],
  animations: [fadeInRightAnimation],
})
export class MonitoreoComponent implements AfterViewInit {
  query = '';
  statusFilter: 'ALL' | CasinoStatus = 'ALL';

  casinos: Casino[] = [
    {
      id: 1,
      name: 'Casino Aurora Centro',
      client: 'Grupo Aurora',
      city: 'CDMX',
      address: 'Av. Reforma 123',
      lat: 19.432608,
      lng: -99.133209,
      status: 'ONLINE',
      updatedAt: 'Hace 2 min'
    },
    {
      id: 2,
      name: 'Casino Nova Norte',
      client: 'Grupo Nova',
      city: 'Monterrey',
      address: 'Av. Constitución 880',
      lat: 25.686614,
      lng: -100.316113,
      status: 'OFFLINE',
      updatedAt: 'Hace 7 min'
    },
    {
      id: 3,
      name: 'Casino Diamante',
      client: 'Diamante Entertainment',
      city: 'Guadalajara',
      address: 'Av. Vallarta 2450',
      lat: 20.67359,
      lng: -103.405625,
      status: 'OFFLINE',
      updatedAt: 'Hace 19 min'
    },
    {
      id: 4,
      name: 'Casino Riviera',
      client: 'Riviera Gaming',
      city: 'Cancún',
      address: 'Blvd. Kukulcán Km 9.5',
      lat: 21.161908,
      lng: -86.851528,
      status: 'ONLINE',
      updatedAt: 'Hace 1 min'
    }
  ];


  filteredCasinos: Casino[] = [];
  selectedCasino: Casino | null = null;

  private map: any;
  private markers = new Map<number, any>();
  private useAltStyle = false;
  private infoWindow: any;


  ngAfterViewInit(): void {
    this.filteredCasinos = [...this.casinos];
    this.selectedCasino = this.filteredCasinos[0] ?? null;

    const waitGoogle = () => {
      const g = window.google;
      if (!g?.maps) {
        setTimeout(waitGoogle, 120);
        return;
      }
      this.initMap();
    };

    waitGoogle();
  }
  private initMap(): void {
    const center = this.selectedCasino
      ? { lat: this.selectedCasino.lat, lng: this.selectedCasino.lng }
      : { lat: 23.6345, lng: -102.5528 };

    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center,
      zoom: this.selectedCasino ? 6 : 5,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      clickableIcons: false
    });

    this.renderMarkers();

    if (this.selectedCasino) {
      this.centerOnSelected();
    }
  }

  private renderMarkers(): void {
    this.markers.forEach(m => m.setMap(null));
    this.markers.clear();

    const bounds = new window.google.maps.LatLngBounds();

    for (const c of this.filteredCasinos) {
      const marker = new window.google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: this.map,
        title: c.name,
        icon: this.getMarkerIcon(c.status),
        optimized: true
      });

      marker.addListener('click', () => this.selectCasino(c));

      marker.addListener('mouseover', () => {
        const payload = {
          name: c.name,
          client: c.client,
          city: c.city,
          address: c.address,
          updatedAt: c.updatedAt,
          status: c.status,
          statusLabel: this.getStatusLabel(c.status)
        };


        if (this.tooltip) {
          this.tooltip.setMap(null);
          this.tooltip = null;
        }

        this.tooltip = new CasinoTooltipOverlay(
          new window.google.maps.LatLng(c.lat, c.lng),
          payload,
          this.map
        );
      });

      marker.addListener('mouseout', () => {
        if (this.tooltip) {
          this.tooltip.setMap(null);
          this.tooltip = null;
        }
      });


      this.markers.set(c.id, marker);
      bounds.extend(marker.getPosition());
    }

    if (this.filteredCasinos.length > 1) {
      this.map.fitBounds(bounds, { top: 80, right: 40, bottom: 40, left: 40 });
    }
  }
  private tooltip: any = null;


  selectCasino(c: Casino): void {
    this.selectedCasino = c;
    this.centerOnSelected();
    this.bumpMarker(c.id);
  }

  centerOnSelected(): void {
    if (!this.map || !this.selectedCasino) return;
    this.map.panTo({ lat: this.selectedCasino.lat, lng: this.selectedCasino.lng });
    const z = Math.max(this.map.getZoom() ?? 6, 12);
    this.map.setZoom(z);
  }

  fitAll(): void {
    if (!this.map || this.filteredCasinos.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    for (const c of this.filteredCasinos) bounds.extend({ lat: c.lat, lng: c.lng });
    this.map.fitBounds(bounds, { top: 80, right: 40, bottom: 40, left: 40 });
  }

  toggleMapStyle(): void {
    if (!this.map) return;
    this.useAltStyle = !this.useAltStyle;
    this.map.setOptions({ styles: this.getMapStyle(this.useAltStyle) });
  }

  applyFilters(): void {
    const q = this.query.trim().toLowerCase();

    this.filteredCasinos = this.casinos.filter(c => {
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q);

      const matchS = this.statusFilter === 'ALL' ? true : c.status === this.statusFilter;

      return matchQ && matchS;
    });

    if (this.selectedCasino && !this.filteredCasinos.some(x => x.id === this.selectedCasino!.id)) {
      this.selectedCasino = this.filteredCasinos[0] ?? null;
    }

    if (this.map) {
      this.renderMarkers();
      if (this.selectedCasino) this.centerOnSelected();
      else this.fitAll();
    }
  }

  setStatus(s: 'ALL' | CasinoStatus): void {
    this.statusFilter = s;
    this.applyFilters();
  }

  getStatusLabel(s: CasinoStatus): string {
    return s === 'ONLINE' ? 'Online' : 'Offline';
  }


  clearSearch(): void {
    this.query = '';
    this.applyFilters();
  }

  focusRouteToSelected(): void {
    if (!this.selectedCasino) return;
    const { lat, lng } = this.selectedCasino;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  }

  trackById(_: number, item: Casino): number {
    return item.id;
  }
  private bumpMarker(id: number): void {
    const m = this.markers.get(id);
    if (!m) return;
    m.setZIndex(9999);
    setTimeout(() => m.setZIndex(undefined), 500);
  }

  private getMarkerIcon(status: CasinoStatus): any {
    const color = status === 'ONLINE' ? '#2fe3a7' : '#ff4b5c';

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      anchor: new window.google.maps.Point(0, 0),
      scale: 8,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#0b0f17',
      strokeOpacity: 1,
      strokeWeight: 3
    };
  }


  private getMapStyle(alt: boolean): any[] {
    if (alt) {
      return [
        { elementType: 'geometry', stylers: [{ color: '#0a0f19' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f19' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#a6b0c3' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#151d2a' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f1520' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#070b12' }] }
      ];
    }

    return [
      { elementType: 'geometry', stylers: [{ color: '#0b0f17' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0f17' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#c9d2e3' }] },
      { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1a2433' }] },
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#141c29' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f1520' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#070b12' }] }
    ];
  }
}






class CasinoTooltipOverlay extends window.google.maps.OverlayView {
  private div: HTMLDivElement | null = null;

  constructor(
    private position: any,
    private payload: {
      name: string;
      client: string;
      city: string;
      address: string;
      updatedAt: string;
      status: 'ONLINE' | 'OFFLINE';
      statusLabel: string;
    },
    private mapRef: any
  ) {
    super();
    this.setMap(mapRef);
  }

  onAdd(): void {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.transform = 'translate(-50%, calc(-100% - 14px))';
    div.style.pointerEvents = 'none';
    div.style.zIndex = '99999';

    div.style.minWidth = '220px';
    div.style.maxWidth = '260px';
    div.style.padding = '10px 12px';
    div.style.borderRadius = '14px';
    div.style.background = 'linear-gradient(180deg, rgba(14,20,34,0.96), rgba(10,15,28,0.96))';
    div.style.boxShadow = '0 18px 55px rgba(0,0,0,0.65)';
    div.style.border = '1px solid rgba(255,255,255,0.10)';
    div.style.backdropFilter = 'blur(10px)';
    div.style.fontFamily = 'Poppins, Arial, sans-serif';
    div.style.color = '#fff';

    const client = document.createElement('div');
    client.textContent = this.payload.client;
    client.style.fontSize = '11px';
    client.style.fontWeight = '800';
    client.style.textTransform = 'uppercase';
    client.style.letterSpacing = '0.6px';
    client.style.marginBottom = '4px';
    client.style.color = '#ff2a79';

    const title = document.createElement('div');
    title.textContent = this.payload.name;
    title.style.fontSize = '13px';
    title.style.fontWeight = '800';
    title.style.letterSpacing = '0.2px';
    title.style.marginBottom = '4px';

    const meta = document.createElement('div');
    meta.textContent = `${this.payload.city} · ${this.payload.address}`;
    meta.style.fontSize = '11.5px';
    meta.style.color = 'rgba(255,255,255,0.78)';
    meta.style.marginBottom = '4px';

    // const addr = document.createElement('div');
    // addr.textContent = this.payload.address;
    // addr.style.fontSize = '11px';
    // addr.style.color = 'rgba(255,255,255,0.62)';
    // addr.style.lineHeight = '1.25';
    // addr.style.marginBottom = '8px';

    const pill = document.createElement('div');
    pill.style.display = 'inline-flex';
    pill.style.alignItems = 'center';
    pill.style.gap = '8px';
    pill.style.padding = '5px 10px';
    pill.style.borderRadius = '999px';
    pill.style.fontSize = '11px';
    pill.style.fontWeight = '800';
    pill.style.border = '1px solid rgba(255,255,255,0.12)';
    pill.style.background = 'rgba(255,255,255,0.06)';

    const dot = document.createElement('span');
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '999px';

    const isOnline = this.payload.status === 'ONLINE';
    const c = isOnline ? '#2fe3a7' : '#ff4b5c';
    dot.style.background = c;
    dot.style.boxShadow = `0 0 12px ${isOnline ? 'rgba(47,227,167,0.55)' : 'rgba(255,75,92,0.55)'}`;
    pill.style.color = c;
    pill.style.borderColor = isOnline ? 'rgba(47,227,167,0.28)' : 'rgba(255,75,92,0.28)';

    const txt = document.createElement('span');
    txt.textContent = this.payload.statusLabel;

    pill.appendChild(dot);
    pill.appendChild(txt);

    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.left = '50%';
    arrow.style.bottom = '-7px';
    arrow.style.transform = 'translateX(-50%) rotate(45deg)';
    arrow.style.width = '14px';
    arrow.style.height = '14px';
    arrow.style.background = 'rgba(10,15,28,0.96)';
    arrow.style.borderRight = '1px solid rgba(255,255,255,0.10)';
    arrow.style.borderBottom = '1px solid rgba(255,255,255,0.10)';

    div.appendChild(client);
    div.appendChild(title);
    div.appendChild(meta);
    // div.appendChild(addr);
    div.appendChild(pill);
    div.appendChild(arrow);

    this.div = div;

    const panes = this.getPanes();
    panes?.floatPane.appendChild(div);
  }

  draw(): void {
    if (!this.div) return;
    const projection = this.getProjection();
    if (!projection) return;

    const point = projection.fromLatLngToDivPixel(this.position);
    if (!point) return;

    this.div.style.left = `${point.x}px`;
    this.div.style.top = `${point.y}px`;
  }

  onRemove(): void {
    if (this.div && this.div.parentNode) {
      this.div.parentNode.removeChild(this.div);
    }
    this.div = null;
  }

  setPosition(pos: any): void {
    this.position = pos;
    this.draw();
  }
}
